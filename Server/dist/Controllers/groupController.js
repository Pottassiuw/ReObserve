"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.tirarUsuarioGrupo = exports.colocarUsuarioGrupo = exports.deletarTodosGruposEmpresa = exports.deletarGrupoEmpresa = exports.verGruposEmpresa = exports.CriarGrupo = void 0;
const prisma_1 = __importDefault(require("../Database/prisma/prisma"));
const CriarGrupo = async (req, res) => {
    try {
        const empresaId = req.params.empresaId;
        const { nome, permissoes } = req.body;
        if (!empresaId) {
            return res.status(400).json({
                error: "ID não fornecido",
                success: false,
            });
        }
        const parsedEmpresaId = parseInt(empresaId);
        if (isNaN(parsedEmpresaId)) {
            return res.status(400).json({
                error: "ID deve ser um número",
                success: false,
                receivedId: empresaId,
            });
        }
        if (!permissoes || !Array.isArray(permissoes)) {
            return res.status(400).json({
                code: "PERMISSIONS_INVALID",
                error: "Permissões devem ser fornecidas como array",
                success: false,
            });
        }
        if (!nome || nome.trim().length === 0) {
            return res.status(400).json({
                code: "NAME_REQUIRED",
                error: "Nome do grupo é obrigatório",
                success: false,
            });
        }
        const empresa = await prisma_1.default.empresa.findUnique({
            where: { id: parsedEmpresaId },
        });
        if (!empresa) {
            return res.status(404).json({
                error: "Empresa não encontrada",
                success: false,
            });
        }
        const permissoesValidas = Object.values(permissoes);
        const permissoesInvalidas = permissoes.filter((p) => !permissoesValidas.includes(p));
        if (permissoesInvalidas.length > 0) {
            return res.status(400).json({
                error: "Permissões inválidas encontradas",
                success: false,
                invalidPermissions: permissoesInvalidas,
                validPermissions: permissoesValidas,
            });
        }
        const grupoExistente = await prisma_1.default.grupo.findFirst({
            where: {
                nome: nome.trim(),
                empresaId: parsedEmpresaId,
            },
        });
        if (grupoExistente) {
            return res.status(400).json({
                error: "Já existe um grupo com este nome na empresa",
                code: "GROUP_NAME_EXISTS",
                success: false,
            });
        }
        const grupo = await prisma_1.default.grupo.create({
            data: {
                empresaId: parsedEmpresaId,
                nome: nome.trim(),
                permissoes: permissoes,
            },
            include: {
                usuarios: {
                    select: {
                        id: true,
                        nome: true,
                        email: true,
                    },
                },
                _count: {
                    select: {
                        usuarios: true,
                    },
                },
            },
        });
        if (!grupo) {
            return res.status(400).json({
                code: "GROUP_NOT_FOUND",
                error: "Grupo não existe",
                success: false,
            });
        }
        return res.status(200).json({
            message: "Grupo criado com sucesso!",
            code: "GROUP_CREATED",
            success: true,
            grupo,
            permissoes,
        });
    }
    catch (error) {
        console.error("Tipo do erro:", error.constructor.name);
        console.error("Mensagem:", error.message);
        console.error("Stack:", error.stack);
        return res.status(500).json({
            error: "Erro interno do servidor",
            success: false,
            errorType: error.constructor.name,
        });
    }
};
exports.CriarGrupo = CriarGrupo;
const verGruposEmpresa = async (req, res) => {
    try {
        const empresaId = req.params.empresaId;
        if (!empresaId) {
            return res.status(400).json({
                error: "ID não fornecido",
                success: false,
            });
        }
        const parsedEmpresaId = parseInt(empresaId);
        if (isNaN(parsedEmpresaId)) {
            return res.status(400).json({
                error: "ID deve ser um número",
                success: false,
                receivedId: empresaId,
            });
        }
        const empresa = await prisma_1.default.empresa.findFirst({
            where: { id: parsedEmpresaId },
        });
        if (!empresa) {
            return res.status(404).json({
                error: "Empresa não encontrada",
                success: false,
            });
        }
        const grupos = await prisma_1.default.grupo.findMany({
            where: { empresaId: parsedEmpresaId },
        });
        if (!grupos) {
            return res.status(404).json({
                error: "Grupos não encontrados",
                success: false,
            });
        }
        return res.status(200).json({
            success: true,
            code: "GROUPS_FOUND",
            message: "Grupos Encontrados!",
            grupos,
        });
    }
    catch (error) {
        console.error("Tipo do erro:", error.constructor.name);
        console.error("Mensagem:", error.message);
        console.error("Stack:", error.stack);
        return res.status(500).json({
            error: "Erro interno do servidor",
            success: false,
            errorType: error.constructor.name,
        });
    }
};
exports.verGruposEmpresa = verGruposEmpresa;
const deletarGrupoEmpresa = async (req, res) => {
    try {
        const empresaId = req.params.empresaId;
        const grupoId = req.params.grupoId;
        if (!empresaId) {
            return res.status(400).json({
                error: "ID não fornecido",
                success: false,
            });
        }
        const parsedEmpresaId = parseInt(empresaId);
        if (isNaN(parsedEmpresaId)) {
            return res.status(400).json({
                error: "ID deve ser um número",
                success: false,
                receivedId: empresaId,
            });
        }
        if (!grupoId) {
            return res.status(400).json({
                error: "ID não fornecido",
                success: false,
            });
        }
        const parsedGrupoId = parseInt(grupoId);
        if (isNaN(parsedGrupoId)) {
            return res.status(400).json({
                error: "ID deve ser um número",
                success: false,
                receivedId: grupoId,
            });
        }
        const empresa = await prisma_1.default.empresa.findFirst({
            where: { id: parsedEmpresaId },
        });
        if (!empresa) {
            return res.status(404).json({
                error: "Empresa não encontrada",
                success: false,
            });
        }
        const grupos = await prisma_1.default.grupo.delete({
            where: { id: parsedGrupoId },
        });
        return res.status(200).json({
            success: true,
            code: "GROUP_DELETED",
            message: "Grupo deletado!",
        });
    }
    catch (error) {
        console.error("Tipo do erro:", error.constructor.name);
        console.error("Mensagem:", error.message);
        console.error("Stack:", error.stack);
        return res.status(500).json({
            error: "Erro interno do servidor",
            success: false,
            errorType: error.constructor.name,
        });
    }
};
exports.deletarGrupoEmpresa = deletarGrupoEmpresa;
const deletarTodosGruposEmpresa = async (req, res) => {
    try {
        const empresaId = req.params.empresaId;
        const grupoId = req.params.grupoId;
        if (!empresaId) {
            return res.status(400).json({
                error: "ID não fornecido",
                success: false,
            });
        }
        const parsedEmpresaId = parseInt(empresaId);
        if (isNaN(parsedEmpresaId)) {
            return res.status(400).json({
                error: "ID deve ser um número",
                success: false,
                receivedId: empresaId,
            });
        }
        if (!grupoId) {
            return res.status(400).json({
                error: "ID não fornecido",
                success: false,
            });
        }
        const parsedGrupoId = parseInt(grupoId);
        if (isNaN(parsedGrupoId)) {
            return res.status(400).json({
                error: "ID deve ser um número",
                success: false,
                receivedId: grupoId,
            });
        }
        const empresa = await prisma_1.default.empresa.findFirst({
            where: { id: parsedEmpresaId },
        });
        if (!empresa) {
            return res.status(404).json({
                error: "Empresa não encontrada",
                success: false,
            });
        }
        const grupos = await prisma_1.default.grupo.deleteMany();
        return res.status(200).json({
            success: true,
            code: "ALL_GROUPS_DELETED",
            message: "Todos os grupos foram deletados!",
        });
    }
    catch (error) {
        console.error("Tipo do erro:", error.constructor.name);
        console.error("Mensagem:", error.message);
        console.error("Stack:", error.stack);
        return res.status(500).json({
            error: "Erro interno do servidor",
            success: false,
            errorType: error.constructor.name,
        });
    }
};
exports.deletarTodosGruposEmpresa = deletarTodosGruposEmpresa;
const colocarUsuarioGrupo = async (req, res) => {
    try {
        const groupId = parseInt(req.params.grupoId);
        const empresaId = parseInt(req.params.empresaId);
        const userId = parseInt(req.params.usuarioId);
        if (!empresaId && !userId && !groupId) {
            return res.status(400).json({
                code: "USERS_AND_ENTERPRISES_AND_GROUPS_NOT_FOUND",
                error: "Doensn't exists",
            });
        }
        const user = await prisma_1.default.usuario.findUnique({
            where: { id: userId },
        });
        if (!user || user.empresaId !== empresaId) {
            return res.status(400).json({
                error: "Usuário não encontrado ou não pertence à empresa",
                code: "NO_USER_OR_USER_DOESN'T_BELONG_TO_ENTERPRISE",
            });
        }
        const group = await prisma_1.default.grupo.findUnique({
            where: { id: groupId },
        });
        if (!group || group.empresaId !== empresaId) {
            return res.status(400).json({
                error: "Grupo não encontrado ou não pertence à empresa",
                code: "NO_GROUP_OR_USER_DOESN'T_BELONG_TO_ENTERPRISE",
            });
        }
        await prisma_1.default.usuario.update({
            where: { id: userId },
            data: { grupoId: group.id },
        });
        return res.status(200).json({
            message: "Usuário agora pertençe ao grupo",
            success: true,
            code: "USER_BELONGS_TO_GROUP",
        });
    }
    catch (error) {
        console.error("Tipo do erro:", error.constructor.name);
        console.error("Mensagem:", error.message);
        console.error("Stack:", error.stack);
        return res.status(500).json({
            error: "Erro interno do servidor",
            success: false,
            errorType: error.constructor.name,
        });
    }
};
exports.colocarUsuarioGrupo = colocarUsuarioGrupo;
const tirarUsuarioGrupo = async (req, res, groupId, empresaId, userId) => {
    try {
        if (!empresaId && !userId && !groupId) {
            return res.status(400).json({
                code: "USERS_AND_ENTERPRISES_AND_GROUPS_NOT_FOUND",
                error: "Doensn't exists",
            });
        }
        const user = await prisma_1.default.usuario.findUnique({
            where: { id: userId },
        });
        if (!user || user.empresaId !== empresaId) {
            return res.status(400).json({
                error: "Usuário não encontrado ou não pertence à empresa",
                code: "NO_USER_OR_USER_DOESN'T_BELONG_TO_ENTERPRISE",
            });
        }
        const group = await prisma_1.default.grupo.findUnique({
            where: { id: groupId },
        });
        if (!group || group.empresaId !== empresaId) {
            return res.status(400).json({
                error: "Grupo não encontrado ou não pertence à empresa",
                code: "NO_GROUP_OR_USER_DOESN'T_BELONG_TO_ENTERPRISE",
            });
        }
        //await prisma.grupo.delete({
        //  where: {
        //  usuarios: [userId],
        //}
        //})
        return res.status(200).json({
            message: "Usuário agora pertençe ao grupo",
            success: true,
            code: "USER_BELONGS_TO_GROUP",
        });
    }
    catch (error) {
        console.error("Tipo do erro:", error.constructor.name);
        console.error("Mensagem:", error.message);
        console.error("Stack:", error.stack);
        return res.status(500).json({
            error: "Erro interno do servidor",
            success: false,
            errorType: error.constructor.name,
        });
    }
};
exports.tirarUsuarioGrupo = tirarUsuarioGrupo;
